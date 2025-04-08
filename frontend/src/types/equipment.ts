export interface Equipment {
  id: string;
  name: string;
}

export interface Position {
  equipmentId?: string; // Opcional, pois não aparece nos itens de 'positions'
  date: string;
  lat: number;
  lon: number;
}

export interface State {
  equipmentId?: string; // Opcional, pois não aparece nos itens de 'states'
  date: string;
  equipmentStateId: string;
}

export interface EquipmentPositionHistory {
  equipmentId: string;
  positions: Position[];
}

export interface EquipmentStateHistory {
  equipmentId: string;
  states: State[];
}
