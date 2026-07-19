from django.contrib import admin
from .models import Material, Supplier, Customer, Purchase, Sale


@admin.register(Material)
class MaterialAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "unit", "current_rate", "stock_quantity", "reorder_level")
    list_filter = ("category",)
    search_fields = ("name",)


@admin.register(Supplier)
class SupplierAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "address")


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("name", "phone", "address")


@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display = ("material", "supplier", "quantity", "rate", "date")
    list_filter = ("date", "material__category")


@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ("material", "customer", "quantity", "rate", "date")
    list_filter = ("date", "material__category")
