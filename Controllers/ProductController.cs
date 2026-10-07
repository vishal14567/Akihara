using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Akihara.Services;
using Akihara.Models;

namespace Akihara.Controllers
{
    [AllowAnonymous]
    public class ProductController : Controller
    {
        private readonly ProductService _productService;

        public ProductController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        public IActionResult Index()
        {
            var products = _productService.GetProducts();
            return View(products);
        }

        [HttpGet]
        public IActionResult Details(string? id)
        {
            if (string.IsNullOrWhiteSpace(id))
            {
                id = "giyu-tomioka-figure";
            }

            var product = _productService.GetProductById(id);
            if (product == null)
            {
                // Fallback to primary product if specified id is not found
                product = _productService.GetProductById("giyu-tomioka-figure");
            }

            if (product == null)
            {
                return NotFound();
            }

            // Also send related products for recommendations
            var allProducts = _productService.GetProducts();
            ViewBag.RelatedProducts = allProducts.Where(p => p.Id != product.Id).Take(5).ToList();

            return View(product);
        }
    }
}
