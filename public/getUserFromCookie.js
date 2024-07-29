const getUserFromCookie = ()=>{
    const cookie = document.cookie;
    const user = cookie.split(';').find(c=>c.includes('user='));
    if(user){
        const userString = user.split('=')[1];
        const decodedJsonString = decodeURIComponent(userString);
        const withoutJ = decodedJsonString.split('j:')[1];
        const userJson = JSON.parse(withoutJ);
        return userJson;
    }
    return null;
}
export default getUserFromCookie;