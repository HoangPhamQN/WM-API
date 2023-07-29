import { Injectable } from '@nestjs/common';

@Injectable()
export class TokenService {
  private readonly tokenMap = new Map<string, Date>();

  // Lưu trữ token và thời gian có thể cấp token mới vào store
  public storeToken(token: string, expiresIn: number): void {
    const expirationTime = new Date(Date.now() + expiresIn * 1000 * 60);
    this.tokenMap.set(token, expirationTime);
  }

  // Kiểm tra xem thời gian có thể cấp token mới có trong store có bé hơn thời gian hiện tại hay không
  //   nếu bé hơn thì mới cho cấp token mới
  public canRenewToken(token: string): boolean {
    const expirationTime = this.tokenMap.get(token);
    return !!expirationTime && expirationTime < new Date();
  }

  // Xóa token khỏi store khi nó hết hạn
  public removeToken(token: string): void {
    this.tokenMap.delete(token);
  }
}
