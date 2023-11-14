type coordinate = {
  latitude: number;
  longitude: number;
};

type LoginDetails = {
  Id?: number;
  InTime: Date | null;
  OutTime: Date | null;
  Comments?: string;
  Latitude?: number;
  Longitude?: number;
};