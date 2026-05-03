import { BadRequestException } from '@nestjs/common';
import { CreateShipmentDto, ShipmentType } from './dtos/create-shipment.dto.js';

export class ShipmentDomain {
  // =========================
  // VALIDACIONES INICIALES
  // =========================
  static validateCreationInput(dto: CreateShipmentDto): void {
    // Debe tener items
    if (!dto.items.length) {
      throw new BadRequestException('Shipment must have at least one item');
    }

    // Validar tipo permitido
    if (![ShipmentType.LAND, ShipmentType.SEA].includes(dto.type)) {
      throw new BadRequestException('Invalid shipment type');
    }

    // Validar productos duplicados
    const uniqueProducts = new Set(dto.items.map((i) => i.productMaskUuid));

    if (uniqueProducts.size !== dto.items.length) {
      throw new BadRequestException('Duplicate products are not allowed');
    }
  }

  // =========================
  // VALIDACIONES POR TIPO
  // =========================
  static validateTypeSpecific(dto: CreateShipmentDto): void {
    // Si el envio es de tipo terreste se debe tener el maskuuid de la
    // bodega y la placa del vehiculo
    if (dto.type === ShipmentType.LAND) {
      if (!dto.warehouseMaskUuid || !dto.vehiclePlate) {
        throw new BadRequestException(
          'Warehouse and vehicle plate are required for land shipment',
        );
      }
    }

    // Si el envio es de tipo maritimo debe tener el maskuuid de la
    // puerto y flota
    if (dto.type === ShipmentType.SEA) {
      if (!dto.portMaskUuid || !dto.fleetNumber) {
        throw new BadRequestException(
          'Port and fleet number are required for sea shipment',
        );
      }
    }
  }

  // =========================
  //  DESCUENTO
  // =========================
  static calculateDiscount(type: ShipmentType, totalQuantity: number): number {
    if (totalQuantity <= 10) return 0;

    if (type === ShipmentType.LAND) return 5;
    if (type === ShipmentType.SEA) return 3;

    return 0;
  }

  // =========================
  // VALIDACION FINANCIERA
  // =========================
  static validateTotalPrice(totalPrice: number): void {
    if (totalPrice < 0) {
      throw new BadRequestException('Total price cannot be negative');
    }
  }
}
