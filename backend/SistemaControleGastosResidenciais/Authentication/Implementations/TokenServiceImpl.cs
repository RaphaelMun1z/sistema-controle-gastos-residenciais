using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SistemaControleGastosResidenciais.Authentication.Interfaces;
using SistemaControleGastosResidenciais.Authentication.Models;
using SistemaControleGastosResidenciais.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace SistemaControleGastosResidenciais.Authentication.Implementations {
    public class TokenServiceImpl : ITokenService {
        private readonly JwtSettings _jwtSettings;

        // Recebe as configurações utilizadas para geração dos tokens JWT
        public TokenServiceImpl(IOptions<JwtSettings> jwtSettings) {
            _jwtSettings = jwtSettings.Value;
        }

        // Gera um token de acesso JWT para a conta autenticada
        public GeneratedToken GenerateAccessToken(Account account) {
            // Define as informações que serão armazenadas dentro do token
            List<Claim> claims = new List<Claim> {
                new Claim(JwtRegisteredClaimNames.Sub, account.Id.ToString()),
                new Claim("personId", account.PersonId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, account.Email),
                new Claim(
                    JwtRegisteredClaimNames.Jti,
                    Guid.NewGuid().ToString()
                )
            };

            // Cria a chave utilizada para assinar digitalmente o token
            SymmetricSecurityKey securityKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_jwtSettings.SecretKey)
            );

            SigningCredentials credentials = new SigningCredentials(
                securityKey,
                SecurityAlgorithms.HmacSha256
            );

            // Define o tempo de expiração do token
            DateTime expiresAt = DateTime.UtcNow.AddMinutes(
                _jwtSettings.AccessTokenExpirationMinutes
            );

            // Cria o token JWT
            JwtSecurityToken token = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                claims: claims,
                expires: expiresAt,
                signingCredentials: credentials
            );

            // Converte o token criado para sua representação em string
            JwtSecurityTokenHandler tokenHandler =
                new JwtSecurityTokenHandler();

            return new GeneratedToken(
                tokenHandler.WriteToken(token),
                expiresAt
            );
        }
    }
}