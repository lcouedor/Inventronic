import { Component } from './component';

export interface ComponentWQuantity {
    componentId: number;
    quantity: number;
}

export interface ComponentWQuantityFull {
    component: Component;
    quantity: number;
}
    