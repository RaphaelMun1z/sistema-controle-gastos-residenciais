using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaControleGastosResidenciais.DTOs.Responses;
using SistemaControleGastosResidenciais.Services.Interfaces;

namespace SistemaControleGastosResidenciais.Controllers {
    [ApiController]
    [Route("api/v1/financial-summary")]
    [Authorize]
    [Tags("Resumo Financeiro")]
    public class FinancialSummaryController : ControllerBase {
        private readonly IFinancialSummaryService _financialSummaryService;

        private readonly ILogger<FinancialSummaryController> _logger;

        public FinancialSummaryController(
            IFinancialSummaryService financialSummaryService,
            ILogger<FinancialSummaryController> logger
        ) {
            _financialSummaryService = financialSummaryService;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(FinancialSummaryResponseDTO))]
        public ActionResult<FinancialSummaryResponseDTO> GetFinancialSummary(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] DateOnly? startDate = null,
            [FromQuery] DateOnly? endDate = null
        ) {
            _logger.LogDebug("Recebida solicitação de resumo financeiro");

            FinancialSummaryResponseDTO response =
                _financialSummaryService.FindFinancialSummary(
                    page,
                    pageSize,
                    startDate,
                    endDate
                );

            return Ok(response);
        }
    }
}