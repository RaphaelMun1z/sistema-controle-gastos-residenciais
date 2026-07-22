using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaControleGastosResidenciais.DTOs.Requests;
using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace SistemaControleGastosResidenciais.Controllers {
    [ApiController]
    [Route("api/v1/auth")]
    [Tags("Autenticação")]
    public class AuthController : ControllerBase {
        private readonly IAuthService _authService;

        private readonly ILogger<AuthController> _logger;

        // Recebe as dependências necessárias para autenticação
        public AuthController(
            IAuthService authService,
            ILogger<AuthController> logger
        ) {
            _authService = authService;
            _logger = logger;
        }

        // Registra uma nova pessoa e sua respectiva conta
        [AllowAnonymous]
        [HttpPost("register")]
        [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(RegisterResponseDTO))]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public ActionResult<RegisterResponseDTO> Register([FromBody] RegisterRequestDTO registerDTO) {
            _logger.LogDebug("Recebida solicitação de cadastro");

            RegisterResponseDTO response = _authService.Register(registerDTO);

            return StatusCode(
                StatusCodes.Status201Created,
                response
            );
        }

        // Autentica uma conta utilizando e-mail e senha
        [AllowAnonymous]
        [HttpPost("login")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(LoginResponseDTO))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult<LoginResponseDTO> Login([FromBody] LoginRequestDTO loginDTO) {
            _logger.LogDebug("Recebida solicitação de autenticação");

            LoginResponseDTO response = _authService.Login(loginDTO);
            return Ok(response);
        }

        [Authorize]
        [HttpGet("me")]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(AuthUserResponseDTO))]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public ActionResult<AuthUserResponseDTO> Me() {
            string? accountIdClaim =
                User.FindFirstValue(JwtRegisteredClaimNames.Sub)
                ?? User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(accountIdClaim) || !Guid.TryParse(accountIdClaim, out Guid accountId)) {
                throw new UnauthorizedAccessException("Usuário não autenticado");
            }

            AuthUserResponseDTO response = _authService.FindAuthenticatedUser(accountId);

            return Ok(response);
        }
    }
}