from django.db import models
from django.utils import timezone


class Material(models.Model):
    """Master list of construction materials — e.g. Cement, Ret (sand), Bajri (gravel)."""

    CATEGORY_CHOICES = [
        ("CEMENT", "Cement"),
        ("RET", "Ret (Sand)"),
        ("BAJRI", "Bajri (Gravel/Aggregate)"),
        ("BRICK", "Bricks"),
        ("STEEL", "Steel"),
        ("OTHER", "Other"),
    ]

    UNIT_CHOICES = [
        ("BAG", "Bag"),
        ("TON", "Ton"),
        ("CFT", "Cubic Feet"),
        ("TROLLEY", "Trolley"),
        ("KG", "Kg"),
        ("PCS", "Pieces"),
    ]

    name = models.CharField(max_length=100)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="OTHER")
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES, default="BAG")
    current_rate = models.DecimalField(max_digits=12, decimal_places=2, help_text="Rate per unit (PKR)")
    stock_quantity = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    reorder_level = models.DecimalField(max_digits=12, decimal_places=2, default=10)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["category", "name"]

    def __str__(self):
        return f"{self.name} ({self.get_unit_display()})"

    @property
    def stock_value(self):
        return round(float(self.current_rate) * float(self.stock_quantity), 2)

    @property
    def is_low_stock(self):
        return self.stock_quantity <= self.reorder_level


class Supplier(models.Model):
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30, blank=True)
    address = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Customer(models.Model):
    name = models.CharField(max_length=150)
    phone = models.CharField(max_length=30, blank=True)
    address = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Purchase(models.Model):
    """Stock-IN transaction: buying material from a supplier."""

    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name="purchases")
    supplier = models.ForeignKey(Supplier, on_delete=models.SET_NULL, null=True, blank=True, related_name="purchases")
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    rate = models.DecimalField(max_digits=12, decimal_places=2, help_text="Purchase rate per unit (PKR)")
    date = models.DateField(default=timezone.now)
    notes = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    @property
    def total_amount(self):
        return round(float(self.quantity) * float(self.rate), 2)

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        if is_new:
            self.material.stock_quantity = float(self.material.stock_quantity) + float(self.quantity)
            self.material.save(update_fields=["stock_quantity"])

    def __str__(self):
        return f"Purchase #{self.id} - {self.material.name} x{self.quantity}"


class Sale(models.Model):
    """Stock-OUT transaction: selling material to a customer."""

    material = models.ForeignKey(Material, on_delete=models.CASCADE, related_name="sales")
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True, related_name="sales")
    quantity = models.DecimalField(max_digits=12, decimal_places=2)
    rate = models.DecimalField(max_digits=12, decimal_places=2, help_text="Sale rate per unit (PKR)")
    date = models.DateField(default=timezone.now)
    notes = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-date", "-created_at"]

    @property
    def total_amount(self):
        return round(float(self.quantity) * float(self.rate), 2)

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        if is_new:
            self.material.stock_quantity = float(self.material.stock_quantity) - float(self.quantity)
            self.material.save(update_fields=["stock_quantity"])

    def __str__(self):
        return f"Sale #{self.id} - {self.material.name} x{self.quantity}"
