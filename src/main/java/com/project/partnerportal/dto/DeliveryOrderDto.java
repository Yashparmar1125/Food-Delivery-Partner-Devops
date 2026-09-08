package com.project.partnerportal.dto;

public class DeliveryOrderDto {

    private String orderId;
    private String restaurantName;
    private String restaurantAddress;
    private String customerName;
    private String customerAddress;
    private Double estimatedPayout;
    private Double distanceKm;
    private String status;
    private Integer itemCount;

    public DeliveryOrderDto() {
    }

    public DeliveryOrderDto(String orderId, String restaurantName, String restaurantAddress,
                            String customerName, String customerAddress, Double estimatedPayout,
                            Double distanceKm, String status, Integer itemCount) {
        this.orderId = orderId;
        this.restaurantName = restaurantName;
        this.restaurantAddress = restaurantAddress;
        this.customerName = customerName;
        this.customerAddress = customerAddress;
        this.estimatedPayout = estimatedPayout;
        this.distanceKm = distanceKm;
        this.status = status;
        this.itemCount = itemCount;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public String getRestaurantAddress() {
        return restaurantAddress;
    }

    public void setRestaurantAddress(String restaurantAddress) {
        this.restaurantAddress = restaurantAddress;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerAddress() {
        return customerAddress;
    }

    public void setCustomerAddress(String customerAddress) {
        this.customerAddress = customerAddress;
    }

    public Double getEstimatedPayout() {
        return estimatedPayout;
    }

    public void setEstimatedPayout(Double estimatedPayout) {
        this.estimatedPayout = estimatedPayout;
    }

    public Double getDistanceKm() {
        return distanceKm;
    }

    public void setDistanceKm(Double distanceKm) {
        this.distanceKm = distanceKm;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getItemCount() {
        return itemCount;
    }

    public void setItemCount(Integer itemCount) {
        this.itemCount = itemCount;
    }
}
