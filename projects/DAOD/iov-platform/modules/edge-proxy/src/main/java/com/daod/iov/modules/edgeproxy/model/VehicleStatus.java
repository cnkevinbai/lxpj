package com.daod.iov.modules.edgeproxy.model;

/**
 * 车辆状态
 */
public class VehicleStatus {
    
    private String vehicleId;
    private String edgeNodeId;
    private long timestamp;
    private String status;
    private String location;
    private double latitude;
    private double longitude;
    private double speed;
    private double batteryLevel;
    private int signalStrength;
    private long odometer;
    private String fuelLevel;
    private String engineStatus;
    private String doorStatus;
    private String lightStatus;
    private String tirePressure;
    private String temperature;
    private String acStatus;
    private String seatStatus;
    private String seatBeltStatus;
    private String parkingStatus;
    private String syncStatus;
    private String lastSyncTime;
    private String nextSyncTime;

    // Getters and Setters
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }

    public String getEdgeNodeId() { return edgeNodeId; }
    public void setEdgeNodeId(String edgeNodeId) { this.edgeNodeId = edgeNodeId; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public double getSpeed() { return speed; }
    public void setSpeed(double speed) { this.speed = speed; }

    public double getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(double batteryLevel) { this.batteryLevel = batteryLevel; }

    public int getSignalStrength() { return signalStrength; }
    public void setSignalStrength(int signalStrength) { this.signalStrength = signalStrength; }

    public long getOdometer() { return odometer; }
    public void setOdometer(long odometer) { this.odometer = odometer; }

    public String getFuelLevel() { return fuelLevel; }
    public void setFuelLevel(String fuelLevel) { this.fuelLevel = fuelLevel; }

    public String getEngineStatus() { return engineStatus; }
    public void setEngineStatus(String engineStatus) { this.engineStatus = engineStatus; }

    public String getDoorStatus() { return doorStatus; }
    public void setDoorStatus(String doorStatus) { this.doorStatus = doorStatus; }

    public String getLightStatus() { return lightStatus; }
    public void setLightStatus(String lightStatus) { this.lightStatus = lightStatus; }

    public String getTirePressure() { return tirePressure; }
    public void setTirePressure(String tirePressure) { this.tirePressure = tirePressure; }

    public String getTemperature() { return temperature; }
    public void setTemperature(String temperature) { this.temperature = temperature; }

    public String getAcStatus() { return acStatus; }
    public void setAcStatus(String acStatus) { this.acStatus = acStatus; }

    public String getSeatStatus() { return seatStatus; }
    public void setSeatStatus(String seatStatus) { this.seatStatus = seatStatus; }

    public String getSeatBeltStatus() { return seatBeltStatus; }
    public void setSeatBeltStatus(String seatBeltStatus) { this.seatBeltStatus = seatBeltStatus; }

    public String getParkingStatus() { return parkingStatus; }
    public void setParkingStatus(String parkingStatus) { this.parkingStatus = parkingStatus; }

    public String getSyncStatus() { return syncStatus; }
    public void setSyncStatus(String syncStatus) { this.syncStatus = syncStatus; }

    public String getLastSyncTime() { return lastSyncTime; }
    public void setLastSyncTime(String lastSyncTime) { this.lastSyncTime = lastSyncTime; }

    public String getNextSyncTime() { return nextSyncTime; }
    public void setNextSyncTime(String nextSyncTime) { this.nextSyncTime = nextSyncTime; }
}
