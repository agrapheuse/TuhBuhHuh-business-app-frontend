import { Setter } from "solid-js";
import { useLocationViewControlContext } from "../pages/DataMap";

export class Grid {
    grid: Array<Location>;
    
    lat_top: number;
    lat_bottom: number;
    
    long_left: number;
    long_right: number;

    constructor(squares: Array<Location>, lib: google.maps.MapsLibrary) {
        this.grid = squares;
        const [lat_top, lat_bottom, long_left, long_right] = this.#calculate_edges();

        this.lat_top = lat_top;
        this.lat_bottom = lat_bottom;
        
        this.long_left = long_left;
        this.long_right = long_right;
    }

    #calculate_edges() {
        let lat_top: number|null = null;
        let lat_bottom: number|null = null;

        let long_left: number|null = null;
        let long_right: number|null = null;

        for(const s of this.grid) {
            if(long_left == null || s.topLeft.lng() < long_left) {
                long_left = s.topLeft.lng();
            }
            if(long_right == null || s.bottomRight.lng() > long_right) {
                long_right = s.bottomRight.lng();
            }
            if(lat_top == null || s.topLeft.lat() > lat_top) {
                lat_top = s.topLeft.lat();
            }
            if(lat_bottom == null || s.bottomRight.lat() < lat_bottom) {
                lat_bottom = s.bottomRight.lat();
            }
        };

        return [lat_top, lat_bottom, long_left, long_right]
    }

    get_edges(): google.maps.LatLngBoundsLiteral {
        return {
            east: this.long_right,
            north: this.lat_top,
            south: this.lat_bottom,
            west: this.long_left,
        };
    }

    get_center(): google.maps.LatLng {
        const lat = ((this.lat_top - this.lat_bottom) / 2 + this.lat_bottom);
        const lng = ((this.long_left - this.long_right) / 2 + this.long_right);
        return new google.maps.LatLng(lat, lng);
    }

    draw_rectangles(map: google.maps.Map): void {
        for(const s of this.grid) {
            s.draw_rectangle(map);
        }
    }

    set_on_clicks(location_setter: Setter<Location|undefined>): void {
        for(const s of this.grid) {
            s.set_on_click(() => {
                location_setter(() => s);
            });
        };
    }

    change_color(color: string): void {
        for(const s of this.grid) {
            s.change_color(color);
        }
    }
}

export class Location {
    readonly uuid: string;
    readonly topLeft: google.maps.LatLng;
    readonly bottomRight: google.maps.LatLng;
    readonly subbed: boolean;

    rectangle: google.maps.Rectangle | null;

    constructor(
        uuid: string,
        latStart: number,
        longStart: number,
        latEnd: number,
        longEnd: number,
        subbed: boolean
    ) {
        this.uuid = uuid;
        this.topLeft = new google.maps.LatLng(
            latStart, longStart,
        );
        this.bottomRight = new google.maps.LatLng(
            latEnd, longEnd
        );
        this.subbed = subbed;
    }

    get_edges(): google.maps.LatLngBoundsLiteral {
        return {
            east: this.bottomRight.lng(),
            north: this.topLeft.lat(),
            south: this.bottomRight.lat(),
            west: this.topLeft.lng(),
        };
    }

    draw_rectangle(map: google.maps.Map): void {
        var fillColor = `#8932a8`;
        if(this.subbed) fillColor = `#fc4c00`;
        this.rectangle = new google.maps.Rectangle({
            bounds: this.get_edges(),
            strokeWeight: 0,
            fillColor: fillColor,
            fillOpacity: 0.5,
            clickable: true
        });

        this.rectangle.setMap(map);
    }

    set_on_click(closure: () => void) {
        this.rectangle.addListener("click", closure);
    }

    change_color(color: string): void {
        if(this.rectangle != null) {
            this.rectangle.setOptions({
                fillColor: color
            });
        }
    }

    

}
