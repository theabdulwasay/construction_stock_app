from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"materials", views.MaterialViewSet)
router.register(r"suppliers", views.SupplierViewSet)
router.register(r"customers", views.CustomerViewSet)
router.register(r"purchases", views.PurchaseViewSet)
router.register(r"sales", views.SaleViewSet)

urlpatterns = [
    path("dashboard/", views.dashboard_summary, name="dashboard-summary"),
    path("", include(router.urls)),
]
