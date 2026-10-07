using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using Akihara.Models;
using Microsoft.AspNetCore.Hosting;

namespace Akihara.Services;

public class TaskService
{
    private readonly string _filePath;

    public TaskService(IWebHostEnvironment? environment = null)
    {
        var rootPath = environment?.ContentRootPath ?? Directory.GetCurrentDirectory();
        var dataDir = Path.Combine(rootPath, "Data");
        if (!Directory.Exists(dataDir))
        {
            Directory.CreateDirectory(dataDir);
        }
        _filePath = Path.Combine(dataDir, "tasks.json");
    }

    public List<TaskItem> GetTasks()
    {
        if (!File.Exists(_filePath))
        {
            return new List<TaskItem>();
        }

        try
        {
            var json = File.ReadAllText(_filePath);
            return JsonSerializer.Deserialize<List<TaskItem>>(json) ?? new List<TaskItem>();
        }
        catch
        {
            return new List<TaskItem>();
        }
    }

    public void SaveTasks(List<TaskItem> tasks)
    {
        try
        {
            var json = JsonSerializer.Serialize(tasks, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(_filePath, json);
        }
        catch
        {
            // Fail silently or log
        }
    }

    public void AddTask(TaskItem task)
    {
        var tasks = GetTasks();
        tasks.Add(task);
        SaveTasks(tasks);
    }

    public void DeleteTask(Guid id)
    {
        var tasks = GetTasks();
        tasks.RemoveAll(t => t.Id == id);
        SaveTasks(tasks);
    }

    public void ToggleTask(Guid id)
    {
        var tasks = GetTasks();
        var task = tasks.Find(t => t.Id == id);
        if (task != null)
        {
            task.IsCompleted = !task.IsCompleted;
            SaveTasks(tasks);
        }
    }
}
