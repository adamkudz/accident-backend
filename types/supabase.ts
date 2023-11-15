export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tbm_profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tbm_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      "tbm-accidents": {
        Row: {
          AccidentSiteCondition: string | null
          Agency: string | null
          AircraftCategory: string | null
          AirMedical: boolean | null
          AirMedicalType: string | null
          AirportId: string | null
          AirportName: string | null
          AmateurBuilt: boolean | null
          AnalysisNarrative: string | null
          BoardLaunch: boolean | null
          BoardMeetingDate: string | null
          City: string | null
          Closed: boolean | null
          CompletionStatus: string | null
          Country: string | null
          Damage: boolean | null
          DamageLevel: string | null
          DocketDate: string | null
          DocketOriginalPublishDate: string | null
          EventDate: string | null
          EventID: string | null
          EventType: string | null
          ExplosionType: string | null
          FactualNarrative: string | null
          FatalInjuryCount: string | null
          FireType: string | null
          FlightOperationType: string | null
          flightScheduledType: string | null
          flightServiceType: string | null
          flightTerminalType: string | null
          HasSafetyRec: boolean | null
          HighestInjury: string | null
          InvestigationClass: string | null
          IsStudy: boolean | null
          Latitude: string | null
          Launch: string | null
          Longitude: string | null
          Make: string | null
          MinorInjuryCount: string | null
          MKey: number
          Mode: string | null
          Model: string | null
          MostRecentReportType: string | null
          NtsbNumber: string | null
          NumberOfEngines: number | null
          Oid: string | null
          OperatorName: string | null
          OriginalPublishedDate: string | null
          PrelimNarrative: string | null
          ProbableCause: string | null
          RegisteredOwner: string | null
          RegistrationNumber: string | null
          RegulationFlightConductedUnder: number | null
          RepGenFlag: boolean | null
          ReportDate: string | null
          ReportNum: string | null
          ReportType: string | null
          RevenueSightseeing: boolean | null
          SecondPilotPresent: boolean | null
          SerialNumber: string | null
          SeriousInjuryCount: string | null
          State: string | null
          VehicleNumber: number | null
        }
        Insert: {
          AccidentSiteCondition?: string | null
          Agency?: string | null
          AircraftCategory?: string | null
          AirMedical?: boolean | null
          AirMedicalType?: string | null
          AirportId?: string | null
          AirportName?: string | null
          AmateurBuilt?: boolean | null
          AnalysisNarrative?: string | null
          BoardLaunch?: boolean | null
          BoardMeetingDate?: string | null
          City?: string | null
          Closed?: boolean | null
          CompletionStatus?: string | null
          Country?: string | null
          Damage?: boolean | null
          DamageLevel?: string | null
          DocketDate?: string | null
          DocketOriginalPublishDate?: string | null
          EventDate?: string | null
          EventID?: string | null
          EventType?: string | null
          ExplosionType?: string | null
          FactualNarrative?: string | null
          FatalInjuryCount?: string | null
          FireType?: string | null
          FlightOperationType?: string | null
          flightScheduledType?: string | null
          flightServiceType?: string | null
          flightTerminalType?: string | null
          HasSafetyRec?: boolean | null
          HighestInjury?: string | null
          InvestigationClass?: string | null
          IsStudy?: boolean | null
          Latitude?: string | null
          Launch?: string | null
          Longitude?: string | null
          Make?: string | null
          MinorInjuryCount?: string | null
          MKey: number
          Mode?: string | null
          Model?: string | null
          MostRecentReportType?: string | null
          NtsbNumber?: string | null
          NumberOfEngines?: number | null
          Oid?: string | null
          OperatorName?: string | null
          OriginalPublishedDate?: string | null
          PrelimNarrative?: string | null
          ProbableCause?: string | null
          RegisteredOwner?: string | null
          RegistrationNumber?: string | null
          RegulationFlightConductedUnder?: number | null
          RepGenFlag?: boolean | null
          ReportDate?: string | null
          ReportNum?: string | null
          ReportType?: string | null
          RevenueSightseeing?: boolean | null
          SecondPilotPresent?: boolean | null
          SerialNumber?: string | null
          SeriousInjuryCount?: string | null
          State?: string | null
          VehicleNumber?: number | null
        }
        Update: {
          AccidentSiteCondition?: string | null
          Agency?: string | null
          AircraftCategory?: string | null
          AirMedical?: boolean | null
          AirMedicalType?: string | null
          AirportId?: string | null
          AirportName?: string | null
          AmateurBuilt?: boolean | null
          AnalysisNarrative?: string | null
          BoardLaunch?: boolean | null
          BoardMeetingDate?: string | null
          City?: string | null
          Closed?: boolean | null
          CompletionStatus?: string | null
          Country?: string | null
          Damage?: boolean | null
          DamageLevel?: string | null
          DocketDate?: string | null
          DocketOriginalPublishDate?: string | null
          EventDate?: string | null
          EventID?: string | null
          EventType?: string | null
          ExplosionType?: string | null
          FactualNarrative?: string | null
          FatalInjuryCount?: string | null
          FireType?: string | null
          FlightOperationType?: string | null
          flightScheduledType?: string | null
          flightServiceType?: string | null
          flightTerminalType?: string | null
          HasSafetyRec?: boolean | null
          HighestInjury?: string | null
          InvestigationClass?: string | null
          IsStudy?: boolean | null
          Latitude?: string | null
          Launch?: string | null
          Longitude?: string | null
          Make?: string | null
          MinorInjuryCount?: string | null
          MKey?: number
          Mode?: string | null
          Model?: string | null
          MostRecentReportType?: string | null
          NtsbNumber?: string | null
          NumberOfEngines?: number | null
          Oid?: string | null
          OperatorName?: string | null
          OriginalPublishedDate?: string | null
          PrelimNarrative?: string | null
          ProbableCause?: string | null
          RegisteredOwner?: string | null
          RegistrationNumber?: string | null
          RegulationFlightConductedUnder?: number | null
          RepGenFlag?: boolean | null
          ReportDate?: string | null
          ReportNum?: string | null
          ReportType?: string | null
          RevenueSightseeing?: boolean | null
          SecondPilotPresent?: boolean | null
          SerialNumber?: string | null
          SeriousInjuryCount?: string | null
          State?: string | null
          VehicleNumber?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
