import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L, {LatLngExpression} from "leaflet";
import './results.css';
import 'leaflet/dist/leaflet.css';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25,41],
    iconAnchor: [12,41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const ResultsView = () => {
    const query = new URLSearchParams(useLocation().search);
    const stop1: number | null = Number(query.get('stop1'));
    const stop2: number | null = Number(query.get('stop2'));
    const trip = query.get('trip');

    const getStopPoints = useCallback(async () => {
        var geojson: GeoJSON.FeatureCollection<GeoJSON.Point> = {
            "type": "FeatureCollection",
            "features": [] as any[],
        }

        var stops = await axios.get(`http://localhost:4000/point?id=${stop1}&id2=${stop2}`);
        var s1Data = stops.data.find((item: { StopId: number | null; }) => item.StopId === stop1);
        var s2Data = stops.data.find((item: { StopId: number | null; }) => item.StopId === stop2);
        var s1Coords = [s1Data.Longitude, s1Data.Latitude];
        var s2Coords = [s2Data.Longitude, s2Data.Latitude];

        geojson.features.push({
            "type": "Feature",
            "properties": {
                "name": s1Data.Name,
                "id": s1Data.StopId,
                "popupContent": `Start: ${s1Data.Name}<br>ID#${s1Data.StopId}`
            },
            "geometry": {
                "type": "Point",
                "coordinates": s1Coords
            }
        });
        geojson.features.push({
            "type": "Feature",
            "properties": {
                "name": s2Data.Name,
                "id": s2Data.StopId,
                "popupContent": `End: ${s2Data.Name}<br>ID#${s2Data.StopId}`
            },
            "geometry": {
                "type": "Point",
                "coordinates": s2Coords
            }
        });
        return geojson;
    }, [stop1, stop2]);

    const getTripPath = useCallback(async () => {
        var tripInfo = await axios.get(`http://localhost:4000/point?id=${trip}`);

        var coords = [];
        for (var i = 0; i < tripInfo.data.length; i++) {
            coords.push([tripInfo.data[i].Longitude, tripInfo.data[i].Latitude]);
        }

        var geojson: GeoJSON.Feature<GeoJSON.LineString> = {
            "type": "Feature",
            "geometry": {
                "type": "LineString",
                "coordinates": coords
            },
            "properties": {
                "name": trip
            }
        }

        return geojson;
    }, [trip]);

    const [stopPoints, setStopPoints] = useState<GeoJSON.FeatureCollection<GeoJSON.Point> | null>(null);
    const [tripPath, setTripPath] = useState<GeoJSON.Feature<GeoJSON.LineString> | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const stopPointsData = await getStopPoints();
            const tripPathData = await getTripPath();
            setStopPoints(stopPointsData);
            setTripPath(tripPathData);
        };
        fetchData();
    }, [getStopPoints, getTripPath]);

    if (!stopPoints || !tripPath) {
        return <div>Loading...</div>;
    }
    
    var center: LatLngExpression = [stopPoints.features[0].geometry.coordinates[1], stopPoints.features[0].geometry.coordinates[0]];

    return (
        <div className="mapView">
            <MapContainer center={center} zoom={12} scrollWheelZoom={true} 
            style={{ height:"50vh",marginTop:"80px", marginBottom:'90px'
            }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                <GeoJSON data={tripPath} />
                <GeoJSON data={stopPoints}
                pointToLayer={ (feature, latlng) => {
                    let color;
                    if (feature.properties.id === stop1) {
                        color = '#7333FF';
                    } else if (feature.properties.id === stop2) {
                        color = 'green';
                    } else {
                        color = 'blue';
                    }
                    return L.circleMarker(latlng, { color });
                }}
                onEachFeature={ (feature, layer) => {
                    layer.bindPopup(feature.properties.popupContent);
                }}/>
            </MapContainer>
        </div>
    )
}

export default ResultsView;