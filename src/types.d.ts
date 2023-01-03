interface DateResponse {
  day: {
    data: string;
    date: string;
    is_date: boolean;
    title: string;
    uuid: string;
  }
}

interface LoginResponse {
  access_token: string;
}

export { DateResponse, LoginResponse };
