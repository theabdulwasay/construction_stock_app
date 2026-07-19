from django.core.management.base import BaseCommand
from django.utils import timezone
import random
from datetime import timedelta

from stock.models import Material, Supplier, Customer, Purchase, Sale


class Command(BaseCommand):
    help = "Seed the database with sample construction materials, suppliers, customers, purchases and sales."

    def handle(self, *args, **options):
        self.stdout.write("Seeding data...")

        materials_data = [
            ("OPC Cement (Bag)", "CEMENT", "BAG", 1550, 120),
            ("White Cement (Bag)", "CEMENT", "BAG", 2200, 40),
            ("Ret / Sand", "RET", "TROLLEY", 6500, 30),
            ("Fine Ret (Chan)", "RET", "TROLLEY", 7000, 18),
            ("Bajri (Gravel)", "BAJRI", "TROLLEY", 8500, 25),
            ("Crush Bajri", "BAJRI", "TROLLEY", 9200, 15),
            ("Red Bricks (A Class)", "BRICK", "PCS", 18, 8000),
            ("Steel Bar (Grade 60)", "STEEL", "TON", 285000, 10),
        ]

        materials = {}
        for name, cat, unit, rate, stock in materials_data:
            m, _ = Material.objects.get_or_create(
                name=name,
                defaults=dict(category=cat, unit=unit, current_rate=rate,
                              stock_quantity=stock, reorder_level=max(2, stock // 4)),
            )
            materials[name] = m

        suppliers_data = [
            ("Bilal Traders", "0300-1234567", "Hazro City"),
            ("Al-Madina Building Materials", "0321-9876543", "Attock Road"),
            ("Khan Sand & Gravel Supply", "0333-4455667", "Indus Highway"),
        ]
        suppliers = []
        for name, phone, addr in suppliers_data:
            s, _ = Supplier.objects.get_or_create(name=name, defaults=dict(phone=phone, address=addr))
            suppliers.append(s)

        customers_data = [
            ("Rana Construction Co.", "0301-1112223", "Hazro"),
            ("Asif Builders", "0345-6667778", "Topi"),
            ("Walk-in Customer", "", ""),
        ]
        customers = []
        for name, phone, addr in customers_data:
            c, _ = Customer.objects.get_or_create(name=name, defaults=dict(phone=phone, address=addr))
            customers.append(c)

        today = timezone.now().date()

        # a handful of purchases and sales over the last 14 days
        for i in range(20):
            mat = random.choice(list(materials.values()))
            sup = random.choice(suppliers)
            qty = round(random.uniform(2, 20), 1)
            rate = float(mat.current_rate) * random.uniform(0.92, 1.0)
            Purchase.objects.create(
                material=mat, supplier=sup, quantity=qty, rate=round(rate, 2),
                date=today - timedelta(days=random.randint(0, 14)),
                notes="Seeded sample purchase",
            )

        for i in range(25):
            mat = random.choice(list(materials.values()))
            cust = random.choice(customers)
            qty = round(random.uniform(1, 12), 1)
            rate = float(mat.current_rate) * random.uniform(1.0, 1.1)
            Sale.objects.create(
                material=mat, customer=cust, quantity=qty, rate=round(rate, 2),
                date=today - timedelta(days=random.randint(0, 14)),
                notes="Seeded sample sale",
            )

        self.stdout.write(self.style.SUCCESS(
            f"Done. {Material.objects.count()} materials, {Supplier.objects.count()} suppliers, "
            f"{Customer.objects.count()} customers, {Purchase.objects.count()} purchases, "
            f"{Sale.objects.count()} sales."
        ))
