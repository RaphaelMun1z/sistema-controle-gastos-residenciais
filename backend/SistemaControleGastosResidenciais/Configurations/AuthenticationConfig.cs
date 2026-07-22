using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SistemaControleGastosResidenciais.Authentication.Models;
using System.Text;

namespace SistemaControleGastosResidenciais.Configurations {
    public static class AuthenticationConfig {
        public static IServiceCollection AddAuthenticationConfiguration(
            this IServiceCollection services,
            IConfiguration configuration
        ) {
            JwtSettings jwtSettings =
                configuration
                    .GetSection("Jwt")
                    .Get<JwtSettings>()
                ?? throw new InvalidOperationException(
                    "Configurações JWT não encontradas"
                );

            if (string.IsNullOrWhiteSpace(jwtSettings.SecretKey)) {
                throw new InvalidOperationException("A chave JWT não foi configurada");
            }

            SymmetricSecurityKey securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSettings.SecretKey)
            );

            services
                .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options => {
                    options.TokenValidationParameters =
                        new TokenValidationParameters {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,

                            ValidIssuer = jwtSettings.Issuer,
                            ValidAudience = jwtSettings.Audience,

                            IssuerSigningKey = securityKey,

                            ClockSkew = TimeSpan.Zero
                        };

                    options.Events = new JwtBearerEvents {
                        OnChallenge = async context => {
                            context.HandleResponse();
                            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                            context.Response.ContentType = "application/problem+json";

                            ProblemDetails problemDetails = new ProblemDetails {
                                Status = StatusCodes.Status401Unauthorized,
                                Title = "Não autorizado",
                                Detail = "É necessário estar autenticado para acessar este recurso",
                                Instance = context.HttpContext.Request.Path
                            };

                            await context.Response.WriteAsJsonAsync(
                                problemDetails
                            );
                        },

                        OnForbidden = async context => {
                            context.Response.StatusCode = StatusCodes.Status403Forbidden;
                            context.Response.ContentType = "application/problem+json";

                            ProblemDetails problemDetails = new ProblemDetails {
                                Status = StatusCodes.Status403Forbidden,
                                Title = "Acesso negado",
                                Detail = "Você não possui permissão para acessar este recurso",
                                Instance = context.HttpContext.Request.Path
                            };

                            await context.Response.WriteAsJsonAsync(
                                problemDetails
                            );
                        }
                    };
                });

            services.AddAuthorization();

            return services;
        }
    }
}