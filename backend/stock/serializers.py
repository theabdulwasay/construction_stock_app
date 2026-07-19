from rest_framework import serializers
from .models import Material, Supplier, Customer, Purchase, Sale


class MaterialSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source="get_category_display", read_only=True)
    unit_display = serializers.CharField(source="get_unit_display", read_only=True)
    stock_value = serializers.ReadOnlyField()
    is_low_stock = serializers.ReadOnlyField()

    class Meta:
        model = Material
        fields = [
            "id", "name", "category", "category_display", "unit", "unit_display",
            "current_rate", "stock_quantity", "reorder_level",
            "stock_value", "is_low_stock", "created_at", "updated_at",
        ]


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = ["id", "name", "phone", "address", "created_at"]


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ["id", "name", "phone", "address", "created_at"]


class PurchaseSerializer(serializers.ModelSerializer):
    material_name = serializers.CharField(source="material.name", read_only=True)
    material_unit = serializers.CharField(source="material.unit", read_only=True)
    supplier_name = serializers.CharField(source="supplier.name", read_only=True, default="")
    total_amount = serializers.ReadOnlyField()

    class Meta:
        model = Purchase
        fields = [
            "id", "material", "material_name", "material_unit", "supplier", "supplier_name",
            "quantity", "rate", "total_amount", "date", "notes", "created_at",
        ]


class SaleSerializer(serializers.ModelSerializer):
    material_name = serializers.CharField(source="material.name", read_only=True)
    material_unit = serializers.CharField(source="material.unit", read_only=True)
    customer_name = serializers.CharField(source="customer.name", read_only=True, default="")
    total_amount = serializers.ReadOnlyField()

    class Meta:
        model = Sale
        fields = [
            "id", "material", "material_name", "material_unit", "customer", "customer_name",
            "quantity", "rate", "total_amount", "date", "notes", "created_at",
        ]
