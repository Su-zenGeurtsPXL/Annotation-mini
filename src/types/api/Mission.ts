export interface Mission {
  identifier: number;
  mission_name: string;
  location: string;
  public: boolean;
  date: Date;
  flights: number[];
  uploaded_by: string; // == uploader_id in MissionPost&MissionPut, BE incosistency
  read_access: string[];
  write_access: string[];
  finished: boolean;
}

export interface MissionPost {
  mission_name: string;
  public: boolean;
  flights: number[];
  read_access: string[]; // auth0_sub of users
  write_access: string[]; // auth0_sub of users
  uploader_id: string; // auth0_sub of users
}

export interface MissionPut {
  identifier: number;
  mission_name: string;
  public: boolean;
  flights: number[];
  uploader_id: string;
  read_access: string[];
  write_access: string[];
}
