import MapLeafletWrapper from '@/components/MapLeafletWrapper';
import MapMaplibreWrapper from '@/components/MapMaplibreWrapper';
import MapMaptilerWrapper from '@/components/MapMaptilerWrapper';

export default function MapPage() {
    return (
        <main style={{ display: 'flex', flexDirection: 'column' }}>
            <MapMaptilerWrapper />
            <MapMaplibreWrapper />
            <MapLeafletWrapper />
        </main>
    );
}