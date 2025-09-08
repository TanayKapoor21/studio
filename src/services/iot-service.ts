'use server';

import { Droplets, Thermometer } from 'lucide-react';

// This is a mock service to simulate fetching IoT device data.
// In a real application, this would make a request to a backend API
// that communicates with your actual devices.

export interface IotDevice {
  name: string;
  id: string;
  status: 'Online' | 'Offline';
  signal: number;
  battery: number;
  data: {
    label: string;
    value: string;
  }[];
}

const initialDevices: IotDevice[] = [
    {
        name: 'Soil Sensor - Plot A',
        id: 'SS-PLOT-A-001',
        status: 'Online',
        signal: 92,
        battery: 88,
        data: [
            { label: 'Moisture', value: '74%' },
            { label: 'Temperature', value: '28°C' },
        ]
    },
    {
        name: 'Weather Station',
        id: 'WS-MAIN-001',
        status: 'Online',
        signal: 98,
        battery: 100,
        data: [
            { label: 'Air Temp', value: '32°C' },
            { label: 'Humidity', value: '65%' },
        ]
    },
    {
        name: 'Drone Camera - North Field',
        id: 'DR-NF-001',
        status: 'Offline',
        signal: 0,
        battery: 12,
        data: []
    }
];

// Simulate dynamic data changes
function getSimulatedData(device: IotDevice): IotDevice {
    // 5% chance of device going offline
    const isOffline = Math.random() < 0.05;
    if (device.id === 'DR-NF-001' || isOffline) {
        return {
            ...device,
            status: 'Offline',
            signal: 0,
            battery: Math.max(0, device.battery - 1),
            data: []
        };
    }

    const newDeviceData = { ...device, status: 'Online' as 'Online' };
    
    // Fluctuate signal strength
    newDeviceData.signal = Math.max(50, Math.min(100, device.signal + Math.floor(Math.random() * 11) - 5));

    // Simulate battery drain
    newDeviceData.battery = Math.max(0, device.battery - (Math.random() * 0.1));

    // Fluctuate sensor data
    newDeviceData.data = device.data.map(d => {
        const currentValue = parseFloat(d.value);
        let newValue = currentValue;
        if (d.label.includes('Moisture') || d.label.includes('Humidity')) {
            newValue = currentValue + (Math.random() * 2 - 1);
            return { ...d, value: `${newValue.toFixed(0)}%` };
        }
        if (d.label.includes('Temp')) {
            newValue = currentValue + (Math.random() * 0.5 - 0.25);
            return { ...d, value: `${newValue.toFixed(1)}°C` };
        }
        return d;
    });

    return newDeviceData;
}


// To connect your real devices, you would replace the contents of this function
// with a fetch call to your backend API endpoint.
export async function getIotDevices(): Promise<IotDevice[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Update device data with simulated values
  const updatedDevices = initialDevices.map(getSimulatedData);
  
  // Keep track of the updated values for the next call
  initialDevices.splice(0, initialDevices.length, ...updatedDevices);

  return updatedDevices;
}
