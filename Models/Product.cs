using System.Collections.Generic;

namespace Akihara.Models
{
    public class ProductOffer
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string TermsUrl { get; set; } = "#";
    }

    public class DeliveryLocationInfo
    {
        public string Pincode { get; set; } = "302017";
        public string City { get; set; } = "Jaipur";
        public string DeliveryDate { get; set; } = "22 May, Thursday";
        public decimal DeliveryFee { get; set; } = 0;
        public decimal OriginalFee { get; set; } = 40;
        public string CutoffTimeLeft { get; set; } = "2h 15m 32s";
    }

    public class RatingBreakdownInfo
    {
        public int FiveStar { get; set; }
        public int FourStar { get; set; }
        public int ThreeStar { get; set; }
        public int TwoStar { get; set; }
        public int OneStar { get; set; }
    }

    public class ProductReview
    {
        public string Id { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string Date { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public bool Verified { get; set; } = true;
        public int HelpfulCount { get; set; }
    }

    public class ProductQna
    {
        public string Question { get; set; } = string.Empty;
        public string Answer { get; set; } = string.Empty;
        public string AskedBy { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
    }

    public class Product
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Brand { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public List<string> CategoryPath { get; set; } = new();
        public string Badge { get; set; } = string.Empty;
        public double Rating { get; set; }
        public int RatingCount { get; set; }
        public int ReviewCount { get; set; }
        public decimal Price { get; set; }
        public decimal OriginalPrice { get; set; }
        public int DiscountPercentage { get; set; }
        public string Currency { get; set; } = "₹";
        public bool InStock { get; set; } = true;
        public int StockQuantity { get; set; } = 10;
        public List<string> Images { get; set; } = new();
        public List<ProductOffer> Offers { get; set; } = new();
        public DeliveryLocationInfo DeliveryLocation { get; set; } = new();
        public List<string> Highlights { get; set; } = new();
        public string Description { get; set; } = string.Empty;
        public Dictionary<string, string> Specifications { get; set; } = new();
        public RatingBreakdownInfo RatingBreakdown { get; set; } = new();
        public List<ProductReview> Reviews { get; set; } = new();
        public List<ProductQna> Qna { get; set; } = new();
    }
}
