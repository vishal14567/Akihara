using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using Akihara.Models;
using Microsoft.AspNetCore.Hosting;

namespace Akihara.Services
{
    public class ProductService
    {
        private readonly string _filePath;
        private static readonly object _fileLock = new();

        public ProductService(IWebHostEnvironment? environment = null)
        {
            var rootPath = environment?.ContentRootPath ?? Directory.GetCurrentDirectory();
            _filePath = Path.Combine(rootPath, "Data", "products.json");
        }

        public List<Product> GetProducts()
        {
            lock (_fileLock)
            {
                return GetProductsInternal();
            }
        }

        public Product? GetProductById(string id)
        {
            if (string.IsNullOrWhiteSpace(id)) return null;

            var products = GetProducts();
            return products.FirstOrDefault(p => p.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
        }

        private List<Product> GetProductsInternal()
        {
            if (!File.Exists(_filePath))
            {
                return new List<Product>();
            }

            try
            {
                var json = File.ReadAllText(_filePath);
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                return JsonSerializer.Deserialize<List<Product>>(json, options) ?? new List<Product>();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error reading products.json: {ex.Message}");
                return new List<Product>();
            }
        }
    }
}
