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

export interface PaymentHistory {
  payment_id: string;
  lecture_id: string;
  payment_type: PaymentType;
  payment_status: PaymentStatus;
  payment_date: string;
  payment_amount: number;
}

export interface PaymentDetail {
  payment_id: string;
  payment_type: PaymentType;
  payment_status: PaymentStatus;
  payment_date: string;
  payment_amount: number;
  lecture_detail: {
    title: string;
    description: string;
    lecture_type: string;
    price: number;
    instructor_id: string;
    image: string | null;
    lecture_id: string;
    created_at: string;
    updated_at: string;
    rating: number;
  }
}