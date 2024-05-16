const headersFormat = (token: string) => {
  let data;
  if (token.startsWith("Bearer ")) {
    data = {
      headers: {
        Authorization: token,
        "Content-Type": "application/json"
      }
    };
  } else {
    data = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    };
  }

  return data;
};

export default headersFormat;
