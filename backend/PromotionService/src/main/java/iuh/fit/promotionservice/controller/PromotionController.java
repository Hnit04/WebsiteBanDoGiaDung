package iuh.fit.promotionservice.controller;

import iuh.fit.promotionservice.dto.request.CreatePromotionRequest;
import iuh.fit.promotionservice.dto.response.PromotionResponse;
import iuh.fit.promotionservice.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {

    private final PromotionService promotionService;

    @Autowired
    public PromotionController(PromotionService promotionService) {
        this.promotionService = promotionService;
    }

    @PostMapping
    public ResponseEntity<PromotionResponse> createPromotion(@RequestBody CreatePromotionRequest request) {
        PromotionResponse promotion = promotionService.createPromotion(request);
        return ResponseEntity.status(201).body(promotion);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<PromotionResponse>> getPromotionsByCategoryId(@PathVariable String categoryId) {
        List<PromotionResponse> promotions = promotionService.getPromotionsByCategoryId(categoryId);
        return ResponseEntity.ok(promotions);
    }

    @GetMapping("/active")
    public ResponseEntity<List<PromotionResponse>> getActivePromotions() {
        List<PromotionResponse> promotions = promotionService.getActivePromotions();
        return ResponseEntity.ok(promotions);
    }
}