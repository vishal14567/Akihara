using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Akihara.Models;
using Akihara.Services;

namespace Akihara.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TaskController : ControllerBase
{
    private readonly TaskService _taskService;

    public TaskController(TaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(_taskService.GetTasks());
    }

    [HttpPost]
    public IActionResult Create([FromBody] TaskItem task)
    {
        if (task == null || string.IsNullOrWhiteSpace(task.Title))
        {
            return BadRequest("Invalid task details");
        }

        task.Id = Guid.NewGuid();
        task.CreatedAt = DateTime.UtcNow;
        _taskService.AddTask(task);
        return Ok(task);
    }

    [HttpPost("toggle/{id}")]
    public IActionResult Toggle(Guid id)
    {
        _taskService.ToggleTask(id);
        return Ok();
    }

    [HttpDelete("{id}")]
    public IActionResult Delete(Guid id)
    {
        _taskService.DeleteTask(id);
        return Ok();
    }
}
