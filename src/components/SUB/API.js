export const getAPIData = () => {
    let apiKey = sessionStorage.getItem('CurEmail') || ''; // sessionStorage에서 값을 가져옴
    let IDKey = sessionStorage.getItem('CurID') || ''; // sessionStorage에서 값을 가져옴
  
    if (localStorage.getItem('Remembercheck')) {
      apiKey = localStorage.getItem('Remembercheck') || ''; // Remembercheck 값으로 apiKey를 덮어씀
      IDKey = localStorage.getItem('RemembercheckID') || ''; // Remembercheck 값으로 IDKey를 덮어씀
    }
  
    return { apiKey, IDKey };
  };