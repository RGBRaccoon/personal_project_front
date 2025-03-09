export enum PaymentType {
    CARD = "CARD",
    BANK_TRANSFER = "BANK_TRANSFER",
    KAKAO_PAY = "KAKAO_PAY",
    NAVER_PAY = "NAVER_PAY",
    TOSS_PAY = "TOSS_PAY",
    PAYCO = "PAYCO",
    LPAY = "LPAY",
    LPAY_CARD = "LPAY_CARD"

  }

export enum PaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}

export interface RentReqeust{
  lecture_id: string;
}


export interface PaymentProcessRequest {
  payment_id: string;
  payment_type: PaymentType;
  payment_status: PaymentStatus;
}