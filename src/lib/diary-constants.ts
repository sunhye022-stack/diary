/** 감정 옵션 (6가지) - 기획서: 행복, 슬픔, 화남, 평온, 설렘, 피곤 */
export const EMOTION_OPTIONS = [
  { value: "happy", label: "행복", emoji: "😊" },
  { value: "sad", label: "슬픔", emoji: "😢" },
  { value: "angry", label: "화남", emoji: "😠" },
  { value: "calm", label: "평온", emoji: "😌" },
  { value: "excited", label: "설렘", emoji: "🥰" },
  { value: "tired", label: "피곤", emoji: "😴" },
] as const;

/** 날씨 옵션 (6가지) - 기획서: 맑음, 흐림, 비, 눈, 바람 + 천둥 */
export const WEATHER_OPTIONS = [
  { value: "sunny", label: "맑음", emoji: "☀️" },
  { value: "cloudy", label: "흐림", emoji: "☁️" },
  { value: "rainy", label: "비", emoji: "🌧️" },
  { value: "snowy", label: "눈", emoji: "❄️" },
  { value: "windy", label: "바람", emoji: "💨" },
  { value: "stormy", label: "천둥", emoji: "⛈️" },
] as const;
