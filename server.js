const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;

// CORS 설정
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// API 키
const API_KEY = '82ecf3750fed4d1160fc3ee0372198df7e6d8f391934374d063b30143c6e7a3f';
const API_ENDPOINT = 'https://apis.data.go.kr/B551182/hospInfoServicev2';

// 병원 정보 API 프록시
app.get('/api/hospitals', async (req, res) => {
    try {
        const { xPos, yPos, radius = '50000' } = req.query;
        
        if (!xPos || !yPos) {
            return res.status(400).json({ error: '좌표 정보가 필요합니다.' });
        }

        // 여러 페이지의 데이터를 가져와서 합치기
        let allHospitals = [];
        const maxPages = 5; // 최대 5페이지까지 가져오기 (500개 병원)
        
        for (let pageNo = 1; pageNo <= maxPages; pageNo++) {
            const params = new URLSearchParams({
                serviceKey: API_KEY,
                pageNo: pageNo.toString(),
                numOfRows: '100',
                type: 'json',
                xPos: xPos,
                yPos: yPos,
                radius: radius
            });

            const url = `${API_ENDPOINT}/getHospBasisList2?${params}`;
            
            console.log(`API 호출 (페이지 ${pageNo}):`, url);
            
            const response = await axios.get(url, {
                timeout: 15000,
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            console.log(`API 응답 상태 (페이지 ${pageNo}):`, response.status);
            
            if (response.data && response.data.response && response.data.response.body) {
                const body = response.data.response.body;
                
                if (body.items && body.items.item) {
                    let hospitals = body.items.item;
                    
                    // 단일 병원인 경우 배열로 변환
                    if (!Array.isArray(hospitals)) {
                        hospitals = [hospitals];
                    }
                    
                    allHospitals = allHospitals.concat(hospitals);
                    console.log(`페이지 ${pageNo}에서 ${hospitals.length}개 병원 추가됨`);
                    
                    // 더 이상 데이터가 없으면 중단
                    if (hospitals.length < 100) {
                        console.log(`페이지 ${pageNo}에서 데이터가 부족하여 중단`);
                        break;
                    }
                } else {
                    console.log(`페이지 ${pageNo}에서 데이터 없음`);
                    break;
                }
            } else {
                console.log(`페이지 ${pageNo}에서 응답 형식 오류`);
                break;
            }
            
            // API 호출 간격을 두어 서버 부하 방지
            if (pageNo < maxPages) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        
        console.log(`총 ${allHospitals.length}개 병원 정보 수집 완료`);
        
        // 응답 데이터 구성
        const responseData = {
            response: {
                header: {
                    resultCode: "00",
                    resultMsg: "NORMAL SERVICE."
                },
                body: {
                    items: {
                        item: allHospitals
                    },
                    numOfRows: allHospitals.length,
                    pageNo: 1,
                    totalCount: allHospitals.length
                }
            }
        };
        
        res.json(responseData);
        
    } catch (error) {
        console.error('API 호출 오류:', error.message);
        
        if (error.response) {
            console.error('응답 상태:', error.response.status);
            console.error('응답 데이터:', error.response.data);
        }
        
        res.status(500).json({ 
            error: '병원 정보를 가져오는 중 오류가 발생했습니다.',
            details: error.message 
        });
    }
});

// 메인 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
    console.log('병원정보서비스 API 프록시 서버가 준비되었습니다.');
});
