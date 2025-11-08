using Microsoft.AspNetCore.Mvc;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly IDataVerseService _dataVerseService;
    private readonly IWebHostEnvironment _environment;

    public HealthController(IDataVerseService dataVerseService, IWebHostEnvironment environment)
    {
        _dataVerseService = dataVerseService;
        _environment = environment;
    }

    [HttpGet]
    public ActionResult GetHealth()
    {
        return Ok(new
        {
            Status = "Healthy",
            Timestamp = DateTime.UtcNow,
            Environment = _environment.EnvironmentName
        });
    }

    [HttpGet("dataverse")]
    public async Task<ActionResult> CheckDataVerse()
    {
        try
        {
            var isConnected = await _dataVerseService.TestConnectionAsync();
            
            var result = new
            {
                Status = isConnected ? "Connected" : "Disconnected",
                Timestamp = DateTime.UtcNow,
                Message = isConnected ? "DataVerse connection successful" : "DataVerse connection failed"
            };

            return isConnected ? Ok(result) : BadRequest(result);
        }
        catch (Exception ex)
        {
            var errorResult = new
            {
                Status = "Error",
                Timestamp = DateTime.UtcNow,
                Message = ex.Message
            };

            return StatusCode(500, errorResult);
        }
    }
}