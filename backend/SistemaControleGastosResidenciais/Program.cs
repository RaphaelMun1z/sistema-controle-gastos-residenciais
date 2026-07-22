using Microsoft.AspNetCore.Identity;
using SistemaControleGastosResidenciais.Authentication.Implementations;
using SistemaControleGastosResidenciais.Authentication.Interfaces;
using SistemaControleGastosResidenciais.Authentication.Models;
using SistemaControleGastosResidenciais.Configurations;
using SistemaControleGastosResidenciais.Configurations.Scalar;
using SistemaControleGastosResidenciais.Configurations.Swagger;
using SistemaControleGastosResidenciais.Entities;
using SistemaControleGastosResidenciais.Exceptions;
using SistemaControleGastosResidenciais.Hateoas.Assemblers;
using SistemaControleGastosResidenciais.Repositories.Implementations;
using SistemaControleGastosResidenciais.Repositories.Interfaces;
using SistemaControleGastosResidenciais.Services.Impl;
using SistemaControleGastosResidenciais.Services.Implementations;
using SistemaControleGastosResidenciais.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Adiciona a configuração do Serilog para logging
builder.AddSerilogLogging();

builder.Services.AddControllers();

// Adiciona a configuração do OpenAPI (Swagger)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerConfig();

// Adiciona a configuração do CORS
builder.Services.AddCorsConfiguration(builder.Configuration);

// Adiciona a configuração das rotas
builder.Services.AddRouteConfig();

// Adiciona as dependências necessárias para geração dos links HATEOAS
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<PersonHateoasAssembler>();
builder.Services.AddScoped<AccountHateoasAssembler>();
builder.Services.AddScoped<TransactionHateoasAssembler>();

// Adiciona a configuração do banco de dados
builder.Services.AddDatabaseConfiguration(builder.Configuration);
// Garante que o banco de dados exista e esteja pronto para uso
DatabaseInitializer.EnsureDatabaseExists(builder.Configuration);
// Adiciona a configuração do Evolve para migrações de banco de dados
builder.Services.AddEvolveConfiguration(builder.Configuration, builder.Environment);

// Adiciona a configuração do JWT para autenticação baseada em tokens
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("Jwt"));
builder.Services.AddAuthenticationConfiguration(builder.Configuration);
builder.Services.AddScoped<ITokenService, TokenServiceImpl>();
builder.Services.AddScoped<IAuthService, AuthServiceImpl>();
builder.Services.AddScoped<IPasswordHasher<Account>, PasswordHasher<Account>>();

builder.Services.AddValidationConfiguration();

// Adiciona os serviços
builder.Services.AddScoped<IPersonService, PersonServiceImpl>();
builder.Services.AddScoped<IAccountService, AccountServiceImpl>();
builder.Services.AddScoped<ITransactionService, TransactionServiceImpl>();
builder.Services.AddScoped<IFinancialSummaryService, FinancialSummaryServiceImpl>();

// Adiciona o repositório genérico
builder.Services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
// Adiciona os repositórios específicos
builder.Services.AddScoped<IPersonRepository, PersonRepository>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<ITransactionRepository, TransactionRepository>();
builder.Services.AddScoped<IFinancialSummaryRepository, FinancialSummaryRepository>();

// Adiciona o tratamento global de exceções
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

var app = builder.Build();
// Adiciona o middleware global de tratamento de exceções
app.UseExceptionHandler();

app.UseHttpsRedirection();
app.UseCorsConfiguration();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.UseSwaggerSpecification();
app.UseScalarSpecification();
app.Run();