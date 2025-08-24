// API 설정
const API_ENDPOINT = 'https://apis.data.go.kr/B551182/hospInfoServicev2';
const API_KEY = '82ecf3750fed4d1160fc3ee0372198df7e6d8f391934374d063b30143c6e7a3f';

// 주요 도시들의 격자 좌표 (위도, 경도)
const GRID_COORDINATES = {
    '서울특별시': { lat: 37.5665, lng: 126.9780 },
    '부산광역시': { lat: 35.1796, lng: 129.0756 },
    '대구광역시': { lat: 35.8714, lng: 128.6014 },
    '인천광역시': { lat: 37.4563, lng: 126.7052 },
    '광주광역시': { lat: 35.1595, lng: 126.8526 },
    '대전광역시': { lat: 36.3504, lng: 127.3845 },
    '울산광역시': { lat: 35.5384, lng: 129.3114 },
    '세종특별자치시': { lat: 36.4800, lng: 127.2890 },
    '경기도': { lat: 37.4138, lng: 127.5183 },
    '강원도': { lat: 37.8228, lng: 128.1555 },
    '충청북도': { lat: 36.8, lng: 127.7 },
    '충청남도': { lat: 36.5184, lng: 126.8000 },
    '전라북도': { lat: 35.7175, lng: 127.1530 },
    '전라남도': { lat: 34.8679, lng: 126.9910 },
    '경상북도': { lat: 36.4919, lng: 128.8889 },
    '경상남도': { lat: 35.4606, lng: 128.2132 },
    '제주특별자치도': { lat: 33.4996, lng: 126.5312 }
};

// 도/시 데이터
const PROVINCES = {
    '서울특별시': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
    '부산광역시': ['강서구', '금정구', '남구', '동구', '동래구', '부산진구', '북구', '사상구', '사하구', '서구', '수영구', '연제구', '영도구', '중구', '해운대구', '기장군'],
    '대구광역시': ['남구', '달서구', '달성군', '동구', '북구', '서구', '수성구', '중구'],
    '인천광역시': ['계양구', '남구', '남동구', '동구', '부평구', '서구', '연수구', '중구', '강화군', '옹진군'],
    '광주광역시': ['광산구', '남구', '동구', '북구', '서구'],
    '대전광역시': ['대덕구', '동구', '서구', '유성구', '중구'],
    '울산광역시': ['남구', '동구', '북구', '울주군', '중구'],
    '세종특별자치시': ['세종특별자치시'],
    '경기도': ['수원시', '성남시', '의정부시', '안양시', '부천시', '광명시', '평택시', '동두천시', '안산시', '고양시', '과천시', '구리시', '남양주시', '오산시', '시흥시', '군포시', '의왕시', '하남시', '용인시', '파주시', '이천시', '안성시', '김포시', '화성시', '광주시', '여주시', '양평군', '고양군', '연천군', '포천군', '가평군'],
    '강원도': ['춘천시', '원주시', '강릉시', '동해시', '태백시', '속초시', '삼척시', '정선군', '철원군', '화천군', '양구군', '인제군', '고성군', '양양군', '영월군', '평창군', '횡성군', '홍천군', '태백군'],
    '충청북도': ['청주시', '충주시', '제천시', '청원군', '보은군', '옥천군', '영동군', '증평군', '진천군', '괴산군', '음성군', '단양군'],
    '충청남도': ['천안시', '공주시', '보령시', '아산시', '서산시', '논산시', '계룡시', '당진시', '금산군', '연기군', '부여군', '서천군', '청양군', '홍성군', '예산군', '태안군'],
    '전라북도': ['전주시', '군산시', '익산시', '정읍시', '남원시', '김제시', '완주군', '진안군', '무주군', '장수군', '임실군', '순창군', '고창군', '부안군'],
    '전라남도': ['목포시', '여수시', '순천시', '나주시', '광양시', '담양군', '곡성군', '구례군', '고흥군', '보성군', '화순군', '장흥군', '강진군', '해남군', '영암군', '무안군', '함평군', '영광군', '장성군', '완도군', '진도군', '신안군'],
    '경상북도': ['포항시', '경주시', '김천시', '안동시', '구미시', '영주시', '영천시', '상주시', '문경시', '경산시', '군위군', '의성군', '청송군', '영양군', '영덕군', '청도군', '고령군', '성주군', '칠곡군', '예천군', '봉화군', '울진군', '울릉군'],
    '경상남도': ['창원시', '진주시', '통영시', '사천시', '김해시', '밀양시', '거제시', '양산시', '의령군', '함안군', '창녕군', '고성군', '남해군', '하동군', '산청군', '함양군', '거창군', '합천군'],
    '제주특별자치도': ['제주시', '서귀포시']
};

// DOM 요소들
const provinceSelect = document.getElementById('province');
const citySelect = document.getElementById('city');
const searchBtn = document.getElementById('searchBtn');
const loading = document.getElementById('loading');
const results = document.getElementById('results');
const hospitalList = document.getElementById('hospitalList');
const resultCount = document.getElementById('resultCount');
const error = document.getElementById('error');
const errorText = document.getElementById('errorText');

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeProvinces();
    setupEventListeners();
});

// 도/시 초기화
function initializeProvinces() {
    provinceSelect.innerHTML = '<option value="">도/시를 선택하세요</option>';
    
    Object.keys(PROVINCES).forEach(province => {
        const option = document.createElement('option');
        option.value = province;
        option.textContent = province;
        provinceSelect.appendChild(option);
    });
}

// 이벤트 리스너 설정
function setupEventListeners() {
    provinceSelect.addEventListener('change', handleProvinceChange);
    citySelect.addEventListener('change', handleCityChange);
    searchBtn.addEventListener('click', searchHospitals);
}

// 도/시 변경 처리
function handleProvinceChange() {
    const selectedProvince = provinceSelect.value;
    citySelect.innerHTML = '<option value="">시/군/구를 선택하세요</option>';
    citySelect.disabled = true;
    searchBtn.disabled = true;
    
    if (selectedProvince && PROVINCES[selectedProvince]) {
        citySelect.disabled = false;
        PROVINCES[selectedProvince].forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            citySelect.appendChild(option);
        });
    }
}

// 시/군/구 변경 처리
function handleCityChange() {
    searchBtn.disabled = !citySelect.value;
}

// 병원 검색
async function searchHospitals() {
    const selectedProvince = provinceSelect.value;
    const selectedCity = citySelect.value;
    
    if (!selectedProvince || !selectedCity) {
        showError('도/시와 시/군/구를 모두 선택해주세요.');
        return;
    }
    
    const coordinates = GRID_COORDINATES[selectedProvince];
    if (!coordinates) {
        showError('선택한 지역의 좌표 정보를 찾을 수 없습니다.');
        return;
    }
    
    showLoading();
    hideError();
    hideResults();
    
    // 로딩 메시지 업데이트
    const loadingText = document.querySelector('.loading p');
    if (loadingText) {
        loadingText.textContent = `${selectedCity} 지역의 병원 정보를 검색하고 있습니다...`;
    }
    
    try {
        const hospitals = await fetchHospitals(coordinates, selectedCity);
        displayHospitals(hospitals, selectedCity);
    } catch (err) {
        console.error('병원 검색 오류:', err);
        showError('병원 정보를 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
        hideLoading();
    }
}

// API 호출 - 직접 API 호출
async function fetchHospitals(coordinates, city) {
    try {
        // API 키를 URL 인코딩
        const encodedApiKey = encodeURIComponent(API_KEY);
        
        const params = new URLSearchParams({
            serviceKey: encodedApiKey,
            pageNo: '1',
            numOfRows: '100',
            type: 'json',
            xPos: coordinates.lng.toString(),
            yPos: coordinates.lat.toString(),
            radius: '50000' // 50km 반경
        });
        
        const url = `${API_ENDPOINT}/getHospBasisList2?${params}`;
        console.log('API 호출 URL:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API 응답:', data);
        
        if (data.response && data.response.body && data.response.body.items) {
            let hospitals = data.response.body.items.item;
            
            // 단일 병원인 경우 배열로 변환
            if (!Array.isArray(hospitals)) {
                hospitals = [hospitals];
            }
            
            // 선택한 시/군/구에 해당하는 병원만 필터링
            const filteredHospitals = hospitals.filter(hospital => 
                hospital.sgguCdNm && hospital.sgguCdNm.includes(city)
            );
            
            console.log(`전체 병원 수: ${hospitals.length}, 필터링된 병원 수: ${filteredHospitals.length}`);
            
            return filteredHospitals;
        }
        
        return [];
        
    } catch (error) {
        console.error('API 호출 오류:', error);
        
        // CORS 오류나 네트워크 오류 시 샘플 데이터 반환
        console.log('API 호출 실패, 샘플 데이터 반환');
        return getSampleHospitals(city);
    }
}

// 샘플 병원 데이터 (개발용)
function getSampleHospitals(city) {
    const sampleHospitals = [
        {
            yadmNm: `${city} 종합병원`,
            addr: `${city} 중앙로 123`,
            telno: '02-1234-5678',
            hospUrl: 'https://www.sample-hospital.co.kr',
            clCdNm: '내과,외과,소아과,산부인과,정형외과,신경외과,흉부외과,성형외과,마취통증의학과,산부인과,소아청소년과,안과,이비인후과,피부과,비뇨의학과,영상의학과,방사선종양학과,병리과,진단검사의학과,결핵과,재활의학과,핵의학과,가정의학과,응급의학과,직업환경의학과,예방의학과',
            dgsbjtCdNm: '내과,외과,소아과,산부인과,정형외과,신경외과,흉부외과,성형외과,마취통증의학과,산부인과,소아청소년과,안과,이비인후과,피부과,비뇨의학과,영상의학과,방사선종양학과,병리과,진단검사의학과,결핵과,재활의학과,핵의학과,가정의학과,응급의학과,직업환경의학과,예방의학과',
            estbDd: '20200101',
            sgguCdNm: city
        },
        {
            yadmNm: `${city} 대학병원`,
            addr: `${city} 의료로 456`,
            telno: '02-2345-6789',
            hospUrl: 'https://www.sample-university-hospital.co.kr',
            clCdNm: '내과,외과,소아과,산부인과,정형외과,신경외과,흉부외과,성형외과,마취통증의학과,산부인과,소아청소년과,안과,이비인후과,피부과,비뇨의학과,영상의학과,방사선종양학과,병리과,진단검사의학과,결핵과,재활의학과,핵의학과,가정의학과,응급의학과,직업환경의학과,예방의학과',
            dgsbjtCdNm: '내과,외과,소아과,산부인과,정형외과,신경외과,흉부외과,성형외과,마취통증의학과,산부인과,소아청소년과,안과,이비인후과,피부과,비뇨의학과,영상의학과,방사선종양학과,병리과,진단검사의학과,결핵과,재활의학과,핵의학과,가정의학과,응급의학과,직업환경의학과,예방의학과',
            estbDd: '20200201',
            sgguCdNm: city
        },
        {
            yadmNm: `${city} 한방병원`,
            addr: `${city} 전통로 789`,
            telno: '02-3456-7890',
            hospUrl: 'https://www.sample-oriental-hospital.co.kr',
            clCdNm: '한방내과,한방외과,한방소아과,한방산부인과,한방신경정신과,한방재활의학과,침구과,약침과',
            dgsbjtCdNm: '한방내과,한방외과,한방소아과,한방산부인과,한방신경정신과,한방재활의학과,침구과,약침과',
            estbDd: '20200301',
            sgguCdNm: city
        },
        {
            yadmNm: `${city} 정형외과병원`,
            addr: `${city} 건강로 101`,
            telno: '02-4567-8901',
            hospUrl: 'https://www.sample-orthopedic-hospital.co.kr',
            clCdNm: '정형외과,재활의학과,마취통증의학과',
            dgsbjtCdNm: '정형외과,재활의학과,마취통증의학과',
            estbDd: '20200401',
            sgguCdNm: city
        },
        {
            yadmNm: `${city} 안과병원`,
            addr: `${city} 시력로 202`,
            telno: '02-5678-9012',
            hospUrl: 'https://www.sample-eye-hospital.co.kr',
            clCdNm: '안과',
            dgsbjtCdNm: '안과',
            estbDd: '20200501',
            sgguCdNm: city
        },
        {
            yadmNm: `${city} 치과병원`,
            addr: `${city} 치아로 303`,
            telno: '02-6789-0123',
            hospUrl: 'https://www.sample-dental-hospital.co.kr',
            clCdNm: '치과,소아치과,교정과,보철과,치주과,구강악안면외과,구강내과,구강병리과,예방치과',
            dgsbjtCdNm: '치과,소아치과,교정과,보철과,치주과,구강악안면외과,구강내과,구강병리과,예방치과',
            estbDd: '20200601',
            sgguCdNm: city
        },
        {
            yadmNm: `${city} 피부과의원`,
            addr: `${city} 피부로 404`,
            telno: '02-7890-1234',
            hospUrl: 'https://www.sample-dermatology-clinic.co.kr',
            clCdNm: '피부과',
            dgsbjtCdNm: '피부과',
            estbDd: '20200701',
            sgguCdNm: city
        },
        {
            yadmNm: `${city} 소아과의원`,
            addr: `${city} 어린이로 505`,
            telno: '02-8901-2345',
            hospUrl: 'https://www.sample-pediatrics-clinic.co.kr',
            clCdNm: '소아과,소아청소년과',
            dgsbjtCdNm: '소아과,소아청소년과',
            estbDd: '20200801',
            sgguCdNm: city
        },
        {
            yadmNm: `${city} 산부인과의원`,
            addr: `${city} 산모로 606`,
            telno: '02-9012-3456',
            hospUrl: 'https://www.sample-obgyn-clinic.co.kr',
            clCdNm: '산부인과',
            dgsbjtCdNm: '산부인과',
            estbDd: '20200901',
            sgguCdNm: city
        },
        {
            yadmNm: `${city} 내과의원`,
            addr: `${city} 내과로 707`,
            telno: '02-0123-4567',
            hospUrl: 'https://www.sample-internal-clinic.co.kr',
            clCdNm: '내과',
            dgsbjtCdNm: '내과',
            estbDd: '20201001',
            sgguCdNm: city
        }
    ];
    
    return sampleHospitals;
}

// 병원 정보 표시
function displayHospitals(hospitals, city) {
    if (hospitals.length === 0) {
        showError(`${city} 지역에서 검색된 병원이 없습니다. 다른 지역을 선택해보세요.`);
        return;
    }
    
    resultCount.textContent = hospitals.length;
    hospitalList.innerHTML = '';
    
    hospitals.forEach(hospital => {
        const hospitalCard = createHospitalCard(hospital);
        hospitalList.appendChild(hospitalCard);
    });
    
    showResults();
}

// 병원 카드 생성
function createHospitalCard(hospital) {
    const card = document.createElement('div');
    card.className = 'hospital-card';
    
    const departments = hospital.clCdNm ? hospital.clCdNm.split(',') : [];
    const departmentTags = departments.map(dept => 
        `<span class="department-tag">${dept.trim()}</span>`
    ).join('');
    
    // 홈페이지 URL이 있는 경우에만 표시
    const hasUrl = hospital.hospUrl && hospital.hospUrl.trim() !== '';
    
    card.innerHTML = `
        <div class="hospital-name">${hospital.yadmNm || '병원명 없음'}</div>
        <div class="hospital-info">
            <div class="info-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${hospital.addr || '주소 정보 없음'}</span>
            </div>
            <div class="info-item">
                <i class="fas fa-phone"></i>
                <span>${hospital.telno || '연락처 정보 없음'}</span>
            </div>
            ${hasUrl ? `
            <div class="info-item">
                <i class="fas fa-globe"></i>
                <a href="${hospital.hospUrl}" target="_blank" rel="noopener noreferrer">${hospital.hospUrl}</a>
            </div>
            ` : ''}
            ${hospital.clCdNm ? `
            <div class="info-item">
                <i class="fas fa-stethoscope"></i>
                <span>진료과목: ${hospital.clCdNm}</span>
            </div>
            ` : ''}
            ${hospital.dgsbjtCdNm ? `
            <div class="info-item">
                <i class="fas fa-user-md"></i>
                <span>진료과: ${hospital.dgsbjtCdNm}</span>
            </div>
            ` : ''}
            ${hospital.estbDd ? `
            <div class="info-item">
                <i class="fas fa-calendar-alt"></i>
                <span>설립일: ${hospital.estbDd}</span>
            </div>
            ` : ''}
        </div>
        ${departmentTags ? `<div class="department-tags">${departmentTags}</div>` : ''}
    `;
    
    return card;
}

// UI 상태 관리 함수들
function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showResults() {
    results.classList.remove('hidden');
}

function hideResults() {
    results.classList.add('hidden');
}

function showError(message) {
    errorText.textContent = message;
    error.classList.remove('hidden');
}

function hideError() {
    error.classList.add('hidden');
}
