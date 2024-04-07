package ba.edu.ibu.sdpfileupload.rest.configuration;
import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "${configuration.swagger.app}",
                version = "1.0.0",
                description = "${configuration.swagger.description}",
                contact = @Contact(name = "${configuration.swagger.developer}", email = "${configuration.swagger.email}")
        ),
        security = {
                @SecurityRequirement(name = "key")
        },
        servers = {
                @Server(url = "/", description = "Default Server URL")
        }
)

@SecurityScheme(
        name = "JWT Security",
        scheme = "bearer",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT"
)



public class SwaggerConfiguration {
}
