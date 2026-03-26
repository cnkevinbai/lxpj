package com.daod.iov.modules.edgeproxy.model;

/**
 * 车辆数据
 */
public class VehicleData {
    
    private String vehicleId;
    private String edgeNodeId;
    private long timestamp;
    private double latitude;
    private double longitude;
    private double speed;
    private double altitude;
    private double heading;
    private double batteryLevel;
    private int signalStrength;
    private String dataType;
    private String data;

    // Getters and Setters
    public String getVehicleId() { return vehicleId; }
    public void setVehicleId(String vehicleId) { this.vehicleId = vehicleId; }

    public String getEdgeNodeId() { return edgeNodeId; }
    public void setEdgeNodeId(String edgeNodeId) { this.edgeNodeId = edgeNodeId; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public double getSpeed() { return speed; }
    public void setSpeed(double speed) { this.speed = speed; }

    public double getAltitude() { return altitude; }
    public void setAltitude(double altitude) { this.altitude = altitude; }

    public double getHeading() { return heading; }
    public void setHeading(double heading) { this.heading = heading; }

    public double getBatteryLevel() { return batteryLevel; }
    public void setBatteryLevel(double batteryLevel) { this.batteryLevel = batteryLevel; }

    public int getSignalStrength() { return signalStrength; }
    public void setSignalStrength(int signalStrength) { this.signalStrength = signalStrength; }

    public String getDataType() { return dataType; }
    public void setDataType(String dataType) { this.dataType = dataType; }

    public String getData() { return data; }
    public void setData(String data) { this.data = data; }
}
