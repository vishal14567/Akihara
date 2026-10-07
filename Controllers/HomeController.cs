using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Akihara.Models;
using Akihara.Services;

namespace Akihara.Controllers;

[Authorize]
public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly TaskService _taskService;

    public HomeController(ILogger<HomeController> logger, TaskService taskService)
    {
        _logger = logger;
        _taskService = taskService;
    }

    public IActionResult Index()
    {
        var tasks = _taskService.GetTasks();
        return View(tasks);
    }

    public IActionResult Privacy()
    {
        return View();
    }

    [AllowAnonymous]
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
