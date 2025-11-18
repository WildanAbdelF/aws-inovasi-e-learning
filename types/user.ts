// types/user.ts
export type User = {
  id: string;        // uuid atau timestamp string
  name: string;
  email: string;
  password: string;  // disimpan plain-text hanya untuk demo lokal (jangan di production)
};
