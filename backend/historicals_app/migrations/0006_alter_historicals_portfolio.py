# Generated by Django 5.0 on 2023-12-28 21:12

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('historicals_app', '0005_alter_historicals_portfolio_value'),
        ('portfolio_app', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='historicals',
            name='portfolio',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='historicals', to='portfolio_app.portfolio'),
        ),
    ]