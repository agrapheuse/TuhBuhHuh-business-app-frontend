export interface Location{
    uuid: string
    topLeft: {
        lat: number
        long: number
    }
    bottomRight: {
        lat: number
        long: number
    }
}
