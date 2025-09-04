package com.reon.backend.jwt;

import com.reon.backend.services.impl.CustomUserDetailService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);
    private final JwtUtils jwtUtils;
    private final CustomUserDetailService customUserDetailService;

    public JwtAuthenticationFilter(JwtUtils jwtUtils, CustomUserDetailService customUserDetailService) {
        this.jwtUtils = jwtUtils;
        this.customUserDetailService = customUserDetailService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // get the jwt from header
            String jwt = jwtUtils.getJwtFromHeader(request);

            // if not null and jwt is valid
            if (jwt != null && jwtUtils.validateToken(jwt)) {

                // we fetch the username -- in our case it's the email
                String username = jwtUtils.getUsernameFromToken(jwt);

                // load user details from database
                UserDetails userDetails = customUserDetailService.loadUserByUsername(username);

                // check if the token username matches database user
                if (username.equals(userDetails.getUsername())) {

                    // create authentication object and set it to security context
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    log.info("Authenticated user: {} with role: {}", username, userDetails.getAuthorities());
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        } catch (RuntimeException exception) {
            log.warn("JWT expired or invalid: {}", exception.getMessage());
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        filterChain.doFilter(request, response);
    }
}
