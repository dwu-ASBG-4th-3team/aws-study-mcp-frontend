export const recordCategories = ["전체", "Security", "Concepts", "Tech", "Billing"] as const;

export const sampleRecords = [
  {
    id: "iam-role-policy",
    category: "Security",
    domain: "Security and Compliance",
    status: "인덱싱 완료",
    title: "IAM Role과 IAM Policy의 차이는?",
    answers: [
      "IAM Policy는 '무엇을 할 수 있는지'를 적어 둔 권한 문서(JSON)예요.",
      "IAM Role은 사용자나 AWS 서비스가 임시로 맡아서 쓰는 신분이에요.",
      "Role에 Policy를 붙이면, 그 Role을 맡은 대상이 해당 권한을 갖게 돼요.",
      "예: EC2가 S3를 읽으려면, S3 읽기 Policy가 붙은 Role을 EC2에 연결해요.",
    ],
    source: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html",
    related: [
      { title: "IAM User와 IAM Role의 차이는?", similarity: "0.87" },
      { title: "IAM Policy는 어떻게 적용되나요?", similarity: "0.81" },
      { title: "서비스 역할(Service Role)이란?", similarity: "0.76" },
    ],
  },
  {
    id: "shared-responsibility",
    category: "Concepts",
    domain: "Cloud Concepts",
    status: "인덱싱 대기",
    title: "공유 책임 모델에서 고객의 책임 범위는?",
    answers: [
      "고객은 클라우드에 저장하는 데이터와 접근 권한, 서비스 보안 설정을 관리해요.",
      "책임 범위는 사용하는 서비스에 따라 달라져요. 예를 들어 EC2를 사용하면 게스트 운영체제의 보안 업데이트도 고객이 관리해요.",
    ],
  },
  {
    id: "ec2-reserved-spot",
    category: "Tech",
    domain: "Cloud Technology and Services",
    status: "인덱싱 실패",
    title: "EC2 예약 인스턴스와 스팟 인스턴스의 차이는?",
    answers: [
      "예약 인스턴스는 일정 기간 약정해 해당 조건의 EC2 사용 요금을 할인받는 방식이에요.",
      "스팟 인스턴스는 남는 EC2 용량을 할인된 가격에 쓰는 방식이에요. 용량이 필요해지면 AWS가 인스턴스를 중단할 수 있어요.",
    ],
  },
  {
    id: "budgets-cost-explorer",
    category: "Billing",
    domain: "Billing, Pricing, and Support",
    status: "인덱싱 완료",
    title: "AWS Budgets와 Cost Explorer의 차이는?",
    answers: [
      "AWS Budgets에서는 예산을 설정하고 실제 또는 예상 지출이 설정한 기준에 도달했을 때 알림을 받을 수 있어요.",
      "Cost Explorer에서는 서비스별 비용과 사용량을 살펴보고 시간에 따른 변화를 분석할 수 있어요.",
    ],
  },
];

export type SampleRecord = (typeof sampleRecords)[number];

export function recordStorageKey(record: SampleRecord, kind: "feedback" | "deleted") {
  const key = `clf-note:sample-record-${kind}`;
  return record.id === sampleRecords[0].id ? key : `${key}:${record.id}`;
}
