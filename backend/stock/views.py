from django.db.models import Sum
from django.utils import timezone
from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Material, Supplier, Customer, Purchase, Sale
from .serializers import (
    MaterialSerializer, SupplierSerializer, CustomerSerializer,
    PurchaseSerializer, SaleSerializer,
)


class MaterialViewSet(viewsets.ModelViewSet):
    queryset = Material.objects.all()
    serializer_class = MaterialSerializer


class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer


class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.select_related("material", "supplier").all()
    serializer_class = PurchaseSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.material.stock_quantity = float(instance.material.stock_quantity) - float(instance.quantity)
        instance.material.save(update_fields=["stock_quantity"])
        return super().destroy(request, *args, **kwargs)


class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.select_related("material", "customer").all()
    serializer_class = SaleSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.material.stock_quantity = float(instance.material.stock_quantity) + float(instance.quantity)
        instance.material.save(update_fields=["stock_quantity"])
        return super().destroy(request, *args, **kwargs)


@api_view(["GET"])
def dashboard_summary(request):
    today = timezone.now().date()
    materials = Material.objects.all()

    total_stock_value = sum(m.stock_value for m in materials)
    low_stock = [m for m in materials if m.is_low_stock]

    today_purchases = Purchase.objects.filter(date=today)
    today_sales = Sale.objects.filter(date=today)

    today_purchase_total = sum(p.total_amount for p in today_purchases)
    today_sale_total = sum(s.total_amount for s in today_sales)

    all_purchases_total = sum(p.total_amount for p in Purchase.objects.all())
    all_sales_total = sum(s.total_amount for s in Sale.objects.all())

    recent_purchases = PurchaseSerializer(
        Purchase.objects.select_related("material", "supplier").all()[:5], many=True
    ).data
    recent_sales = SaleSerializer(
        Sale.objects.select_related("material", "customer").all()[:5], many=True
    ).data

    return Response({
        "total_materials": materials.count(),
        "total_stock_value": round(total_stock_value, 2),
        "low_stock_count": len(low_stock),
        "low_stock_items": MaterialSerializer(low_stock, many=True).data,
        "today_purchase_total": round(today_purchase_total, 2),
        "today_sale_total": round(today_sale_total, 2),
        "today_purchase_count": today_purchases.count(),
        "today_sale_count": today_sales.count(),
        "all_time_purchase_total": round(all_purchases_total, 2),
        "all_time_sale_total": round(all_sales_total, 2),
        "recent_purchases": recent_purchases,
        "recent_sales": recent_sales,
        "materials_by_category": MaterialSerializer(materials, many=True).data,
    })
