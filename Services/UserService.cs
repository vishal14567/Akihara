using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using Akihara.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Hosting;

namespace Akihara.Services;

public class UserService
{
    private readonly string _filePath;
    private static readonly object _fileLock = new();

    public UserService(IWebHostEnvironment? environment = null)
    {
        var rootPath = environment?.ContentRootPath ?? Directory.GetCurrentDirectory();
        var dataDir = Path.Combine(rootPath, "Data");
        if (!Directory.Exists(dataDir))
        {
            Directory.CreateDirectory(dataDir);
        }
        _filePath = Path.Combine(dataDir, "users.json");

        InitializeDefaultUser();
    }

    private void InitializeDefaultUser()
    {
        lock (_fileLock)
        {
            var users = GetUsersInternal();
            if (!users.Any(u => u.Email.Equals("user@akihara.com", StringComparison.OrdinalIgnoreCase)))
            {
                var defaultUser = new User
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = "user@akihara.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Password123"),
                    CreatedAt = DateTime.UtcNow
                };

                users.Add(defaultUser);
                SaveUsersInternal(users);
            }
        }
    }

    public List<User> GetUsers()
    {
        lock (_fileLock)
        {
            return GetUsersInternal();
        }
    }

    private List<User> GetUsersInternal()
    {
        if (!File.Exists(_filePath))
        {
            return new List<User>();
        }

        try
        {
            var json = File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<User>>(json) ?? new List<User>();
        }
        catch
        {
            return new List<User>();
        }
    }

    public User? GetUserByEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email)) return null;
        var users = GetUsers();
        return users.FirstOrDefault(u => u.Email.Equals(email.Trim(), StringComparison.OrdinalIgnoreCase));
    }

    public (bool Success, string Message) RegisterUser(string email, string password)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            return (false, "Email and password are required.");
        }

        var normalizedEmail = email.Trim();
        lock (_fileLock)
        {
            var users = GetUsersInternal();
            if (users.Any(u => u.Email.Equals(normalizedEmail, StringComparison.OrdinalIgnoreCase)))
            {
                return (false, "An account with this email address already exists.");
            }

            var newUser = new User
            {
                Id = Guid.NewGuid().ToString(),
                Email = normalizedEmail,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                CreatedAt = DateTime.UtcNow
            };

            users.Add(newUser);
            SaveUsersInternal(users);
            return (true, "Account created successfully.");
        }
    }

    public User? ValidateUser(string email, string password)
    {
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            return null;
        }

        var user = GetUserByEmail(email);
        if (user == null)
        {
            return null;
        }

        try
        {
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(password, user.PasswordHash);
            return isPasswordValid ? user : null;
        }
        catch
        {
            return null;
        }
    }

    private void SaveUsersInternal(List<User> users)
    {
        try
        {
            var options = new JsonSerializerOptions { WriteIndented = true };
            var json = JsonSerializer.Serialize(users, options);
            File.WriteAllText(_filePath, json);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving users to JSON: {ex.Message}");
        }
    }
}
