import type { IGlobePoint } from './utils'

export interface IPoint extends IGlobePoint {
  name: string
}

export const data: IPoint[] = [
  {
    latitude: 52.88155968625129,
    longitude: 103.25823472046591,
    name: 'ИРНР'
  }
]