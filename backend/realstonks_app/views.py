from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import StockMarketSerializer
from .models import StockMarket
from rest_framework.status import (
    HTTP_204_NO_CONTENT,
    HTTP_404_NOT_FOUND,
)


# Create your views here.
class RealStonks(APIView):
    def get(self, request):
        try:
            stocks = StockMarketSerializer(
                StockMarket.objects.order_by("price"), many=True
            )
            return Response(stocks.data, status=HTTP_204_NO_CONTENT)
        except:
            return Response(status=HTTP_404_NOT_FOUND)
