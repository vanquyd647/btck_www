package nhom3.ShoeStore.demo.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfiguration {
    @Bean
    public OpenAPI defineOpenApi() {
        Server server = new Server();
        server.setUrl("http://localhost:8088");
        server.setDescription("Shoe Store Management API Documentation");
        
        Info information = new Info()
            .title("Shoe Store API Documentation")
            .version("1.0")
            .description("This API exposes endpoints to manage shoes, categories, and more.");
        
        return new OpenAPI().info(information).servers(List.of(server));
    }
}
