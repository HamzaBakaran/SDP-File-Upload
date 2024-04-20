interface DecodedToken {
    // Define the properties you expect in the decoded token
    // For example, you might have 'sub' (subject), 'exp' (expiration time), 'name', etc.
    sub: string;
    exp: number;
    id: string;
    authorities: { authority: string }[];
    // Add other properties as needed
  }
  
  function parseJwt(token: string): DecodedToken | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
  
      return JSON.parse(jsonPayload);
    } catch (error) {
      // Token is invalid or expired
      console.error('Error parsing JWT:', error);
      return null;
    }
  }
export default parseJwt;  