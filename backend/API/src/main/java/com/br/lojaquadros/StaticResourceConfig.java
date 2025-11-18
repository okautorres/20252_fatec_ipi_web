package com.br.lojaquadros;

import java.nio.file.Paths;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class StaticResourceConfig implements WebMvcConfigurer {

    private static final Logger log = LoggerFactory.getLogger(StaticResourceConfig.class);

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // pasta 'uploads' relativa ao diretório onde a JVM foi iniciada
        String uploadsAbsolute = Paths.get("uploads").toAbsolutePath().toString(); // ex: /home/usuario/projeto/uploads
        String resourceLocation = "file:" + uploadsAbsolute + "/"; // importante o prefixo file: e o slash final

        log.info("Expondo /uploads/** -> " + resourceLocation);

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(resourceLocation);
    }
}
